/**
 * Credits for the city photos in the events calendar (public/assets/events),
 * shown on /photo-credits. Photos from the site's own events need no entry.
 *
 * Creative Commons BY and BY-SA photos must keep their credit, licence link and
 * a note that they were changed (all are cropped to 16:9 and resized).
 */
export type PhotoCredit = {
  /** File under public/assets/events. */
  file: string;
  place: string;
  author: string;
  licence: string;
  licenceUrl: string;
  sourceName: string;
  sourceUrl: string;
};

const UNSPLASH = { licence: 'Unsplash License', licenceUrl: 'https://unsplash.com/license', sourceName: 'Unsplash' };
const commons = (licence: string, licenceUrl: string) => ({ licence, licenceUrl, sourceName: 'Wikimedia Commons' });

export const photoCredits: PhotoCredit[] = [
  { file: 'amsterdam.jpg', place: 'Amsterdam', author: 'Denis', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/bicycles-parked-on-a-bridge-over-a-canal-in-amsterdam-f7xGAjyXehU' },
  { file: 'bangkok.jpg', place: 'Bangkok', author: 'allPhoto Bangkok', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/a-view-of-a-city-at-night-from-across-the-water-cj7KG6jjaaA' },
  { file: 'barcelona.jpg', place: 'Barcelona', author: 'Salma Abdelnaby', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/barcelona-cityscape-with-sagrada-familia-at-sunset-u5DXeHhcQUc' },
  { file: 'cannes.jpg', place: 'Cannes', author: 'Zaki', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/coastal-city-with-yachts-in-the-harbor-and-flowers-IzhyByN7ITw' },
  { file: 'doha.jpg', place: 'Doha', author: 'Thameur Belghith', ...commons('CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'), sourceUrl: 'https://commons.wikimedia.org/wiki/File:Doha_West_Bay_Skyline_Qatar_Jan_2020.jpg' },
  { file: 'uae.jpg', place: 'Dubai (AIBC Eurasia / SiGMA)', author: 'Ansub Khan', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/dubai-city-skyline-illuminated-at-night-with-burj-khalifa-zCYVd3IN6l8' },
  { file: 'helsinki.jpg', place: 'Helsinki', author: 'Alf Altendorf', ...commons('CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0/'), sourceUrl: 'https://commons.wikimedia.org/wiki/File:Helsinki_skyline_(Sep_2024_-_02).jpg' },
  { file: 'las-vegas.jpg', place: 'Las Vegas', author: 'Parsa Mahmoudi', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/the-las-vegas-strip-at-night-with-the-eiffel-tower-in-the-background-PYaP4awj9Uc' },
  { file: 'lisbon.jpg', place: 'Lisbon', author: 'Timur Seyfelmlyukov', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/lisbon-cityscape-with-castle-and-rooftops-YhxF9dkf7-Y' },
  { file: 'malta.jpg', place: 'Malta', author: 'TerryDOtt', ...commons('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'), sourceUrl: 'https://commons.wikimedia.org/wiki/File:Valletta,_Malta_-_Old_Meets_New.jpg' },
  { file: 'manila.jpg', place: 'Manila', author: 'Spearminttt', ...commons('CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/'), sourceUrl: 'https://commons.wikimedia.org/wiki/File:MANILA_SKYLINE_01.JPG' },
  { file: 'miami.jpg', place: 'Miami', author: 'Alejandro Luengo', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/city-skyline-between-sky-and-body-of-water-Ev0Vj_0PPck' },
  { file: 'nashville.jpg', place: 'Nashville', author: 'Peter Muniz', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/nashville-tennessee-skyline-showcases-city-architecture-Yk7787AuVRc' },
  { file: 'new-york.jpg', place: 'New York', author: 'Patrick Tomasso', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/manhattan-skyline-and-brooklyn-bridge-SVVTZtTGyaU' },
  { file: 'riyadh.jpg', place: 'Riyadh', author: 'Ibrahim Abdullah', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/kingdom-centre-skyscraper-in-riyadh-_UxsPARhtOg' },
  { file: 'rome.jpg', place: 'Rome', author: 'Cristina Gottardi', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/coliseum-rome-italy-VhlLC2eNSuo' },
  { file: 'san-francisco.jpg', place: 'San Francisco', author: 'Denys Nevozhai', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/golden-gate-bridge-san-francisco-ts-CYh3wUE4' },
  { file: 'san-jose.jpg', place: 'San Jose', author: 'Adam Schultz', ...commons('CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'), sourceUrl: 'https://commons.wikimedia.org/wiki/File:SAN_JOSE_CALIFORNIA_BAYAREA01.jpg' },
  { file: 'seoul.jpg', place: 'Seoul', author: 'Yohan Cho', ...UNSPLASH, sourceUrl: 'https://unsplash.com/photos/lighted-city-skyline-at-night-Mwvhyd22Lyw' },
  { file: 'vancouver.jpg', place: 'Vancouver', author: 'Murray Foubister', ...commons('CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0/'), sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vancouver_skyline_(49108878382).jpg' },
];
