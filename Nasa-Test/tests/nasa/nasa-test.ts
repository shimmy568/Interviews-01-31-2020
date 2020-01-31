import {} from "jasmine";
import { DailyImage } from "../../src/nasa/daily-image";
import { getTimeline } from "../../src/nasa/timeline";

const exampleResponse = {
  date: "2020-01-22",
  explanation:
    "It is the closest cluster of stars to the Sun. The Hyades open cluster " +
    "is bright enough to have been remarked on even thousands of years ago, yet is not as bright" +
    " or compact as the nearby Pleiades (M45) star cluster. Pictured here is a particularly deep " +
    "image of the Hyades which has brings out vivid star colors and faint coincidental " +
    "nebulas.  The brightest star in the field is yellow Aldebaran, the eye of the bull " +
    "toward the constellation of Taurus. Aldebaran, at 65 light-years away, is now known " +
    "to be unrelated to the Hyades cluster, which lies about 150 light-years away.  " +
    "The central Hyades stars are spread out over about 15 light-years. Formed about 625" +
    " million years ago, the Hyades likely shares a common origin with the Beehive cluster" +
    " (M44), a naked-eye open star cluster toward the constellation of Cancer, based on " +
    "M44's motion through space and remarkably similar age.",
  media_type: "image",
  title: "The Hyades Star Cluster",
  url: "https://apod.nasa.gov/apod/image/2001/Hyades_Mtanous_1080.jpg"
};

describe("daily_image_tests", () => {
  it("invalid date", async () => {
    const daily = new DailyImage();
    const result = await daily.getImageForDate("blah");
    expect(result).toBeUndefined();
  });

  it("valid date", async () => {
    const res = {
      date: "2020-01-21",
      explanation: "test",
      media_type: "video",
      title: "Parker: Sounds of the Solar Wind",
      url: "https://www.youtube.com/embed/hgzGET6owYk?rel=0"
    };
    const daily = new DailyImage();
    spyOn(daily, "imageGet").and.returnValue(Promise.resolve(res));
    const result = await daily.getImageForDate("2020-01-21");
    expect(result).toEqual(res);
  });

  // THIS WILL FAIL IF YOU DON'T HAVE AN API KEY SET
  it("actually make api call", async () => {
    const daily = new DailyImage();
    const result = await daily.getImageForDate("2020-01-22");
    expect(result).toEqual(exampleResponse);
  });
});

describe("timeline_tests", () => {
  it("valid input", async () => {
    const timeline = await getTimeline([
      "2020-01-22",
      "2020-01-23",
      "2020-01-24"
    ]);

    expect(timeline).toBeDefined();
    expect(timeline.length).toEqual(3);

    expect(timeline[0]).toEqual(exampleResponse);
  });

  it("invalid date input", async () => {
    const timeline = await getTimeline([
      "2020-01-838383818238388383",
      "2020-01-23",
      "2020-01-24"
    ]);

    expect(timeline).toBeDefined();
    expect(timeline.length).toEqual(3);
    expect(timeline[2]).toBeUndefined(); // Expect there to be an error for the first image
  });
});
