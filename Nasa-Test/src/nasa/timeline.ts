import { DailyImage, IDailyImage } from "./daily-image";

export type TimelineResponse = {
  timeline: IDailyImage[];
};

/**
 * Gets a timeline of daily images from the NASA image API
 *
 * @param dates A list of the dates to get the timeline for in string format
 *
 * @returns A list of the image objects
 */
export async function getTimeline(dates: string[]): Promise<IDailyImage[]> {
  const dailyImage = new DailyImage();

  // Make all the requests concurrently using Promise.all
  const images = await Promise.all(
    dates.map(date => dailyImage.getImageForDate(date))
  );

  // Sort images by date before returning them
  return images.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
