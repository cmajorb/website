import { APIGatewayProxyHandler } from 'aws-lambda';
import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { S3 } from 'aws-sdk';

const parser = new Parser();
const s3 = new S3();

const BUCKET_NAME = process.env.CACHE_BUCKET!;
const CACHE_KEY = 'goodreads-cache.json';
const TTL_MS = 24 * 60 * 60 * 1000; // 1 day

function extractBookData(item: any) {
  const content = item.content;

  const imageMatch = content.match(/<img [^>]*src="([^"]+)"/);
  const authorMatch = content.match(/author:\s*([^<]+)<br\/>/);
  const ratingMatch = content.match(/(?<!average\s)rating:\s*([^<]+)<br\/>/i);
  const readAtMatch = content.match(/read at:\s*([^<]+)<br\/>/);
  const reviewMatch = content.match(/review:\s*<br\/>([\s\S]*?)<br\/>/);

  return {
    title: item.title,
    link: item.link,
    image: imageMatch?.[1]?.trim() ?? null,
    author: authorMatch?.[1]?.trim() ?? null,
    rating: ratingMatch?.[1]?.trim() ?? null,
    readAt: readAtMatch?.[1]?.trim() ?? null,
    review: reviewMatch?.[1]?.trim() ?? null,
  };
}

export const handler: APIGatewayProxyHandler = async () => {
  try {
    // 1. Try to get cached object
    const head = await s3.headObject({ Bucket: BUCKET_NAME, Key: CACHE_KEY }).promise();
    const lastModified = new Date(head.LastModified || 0).getTime();
    const now = Date.now();

    if (now - lastModified < TTL_MS) {
      const cached = await s3.getObject({ Bucket: BUCKET_NAME, Key: CACHE_KEY }).promise();
      const body = cached.Body!.toString('utf-8');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body,
      };
    }
  } catch (err) {
    console.log('No cache or cache expired. Fetching fresh...');
    // Ignore error and fetch new
  }

  try {
    const rssUrl = 'https://www.goodreads.com/review/list_rss/2366115-major-b?shelf=read';
    const response = await fetch(rssUrl);
    const xml = await response.text();

    const feed = await parser.parseString(xml);
    const books = feed.items?.map(extractBookData) || [];

    const payload = JSON.stringify({ status: 'ok', books });

    // Save to S3
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: CACHE_KEY,
      Body: payload,
      ContentType: 'application/json',
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: payload,
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ status: 'error', message: error.message }),
    };
  }
};
