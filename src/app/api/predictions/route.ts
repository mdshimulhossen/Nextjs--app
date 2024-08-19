import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model = process.env.REPLICATE_MODEL!;
const version = process.env.REPLICATE_MODEL_VERSION;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.');
    }
    if (!model) {
      throw new Error('The REPLICATE_MODEL environment variable is not set. See README.md for instructions on how to set it.');
    }
    if (!version) {
      throw new Error('The REPLICATE_MODEL_VERSION environment variable is not set. See README.md for instructions on how to set it.');
    }

    const { prompt } = await request.json();

    // A prediction is the result you get when you run a model, including the input, output, and other details
    const prediction = await replicate.predictions.create({
      input: { prompt },
      model,
      version,
    });

    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error(String(error));
    return NextResponse.json({ detail: String(error) }, { status: 500 });
  }
}
