import { generateOpenAiImageQuery } from '@/services/openai';
import {
  AI_IMAGE_QUERIES,
  AiAutoGeneratedField,
  parseTitleAndCaption,
} from '.';

export const generateAiImageQueries = async (
  imageBase64?: string,
  textFieldsToGenerate: AiAutoGeneratedField[] = [],
): Promise<{
  title?: string
  caption?: string
  tags?: string
  semanticDescription?: string
  error?: string
}> => {
  let title: string | undefined;
  let caption: string | undefined;
  let tags: string | undefined;
  let semanticDescription: string | undefined;
  let error: string | undefined;

  try {
    if (imageBase64) {
      if (
        textFieldsToGenerate.includes('title') &&
        textFieldsToGenerate.includes('caption')
      ) {
        const titleAndCaption = await generateOpenAiImageQuery(
          imageBase64,
          AI_IMAGE_QUERIES['title-and-caption'],
        );
        if (titleAndCaption) {
          const titleAndCaptionParsed = parseTitleAndCaption(titleAndCaption);
          title = titleAndCaptionParsed.title;
          caption = titleAndCaptionParsed.caption;
        }
      } else {
        if (textFieldsToGenerate.includes('title')) {
          title = await generateOpenAiImageQuery(
            imageBase64,
            AI_IMAGE_QUERIES['title'],
          );
        }
        if (textFieldsToGenerate.includes('caption')) {
          caption =  await generateOpenAiImageQuery(
            imageBase64,
            AI_IMAGE_QUERIES['caption'],
          );
        }
      }
  
      if (textFieldsToGenerate.includes('tags')) {
        tags = await generateOpenAiImageQuery(
          imageBase64,
          AI_IMAGE_QUERIES['tags'],
        );
      }
  
      if (textFieldsToGenerate.includes('semantic')) {
        semanticDescription = await generateOpenAiImageQuery(
          imageBase64,
          AI_IMAGE_QUERIES['description-small'],
        );
      }
    }
  } catch (e: any) {
    error = e.message;
    console.log('Error generating AI image text', e.message);
  }

  return {
    title,
    caption,
    tags,
    semanticDescription,
    error,
  };
};
