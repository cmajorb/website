import { APIGatewayProxyHandler } from 'aws-lambda';
import Parser from 'rss-parser';
import fetch from 'node-fetch';

const parser = new Parser();

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

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const rssUrl = 'https://www.goodreads.com/review/list_rss/2366115-major-b?shelf=read';

    // Fetch the RSS feed XML as text
    const response = await fetch(rssUrl);
    const xml = await response.text();

    // Parse the XML feed
    const feed = await parser.parseString(xml);
    console.log(feed);

    // Map to simplified format
    const books = feed.items?.map(extractBookData) || [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins, or replace with specific domain
      },
      body: JSON.stringify({ status: 'ok', books }),
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
