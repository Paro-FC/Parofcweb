// News queries
export const NEWS_QUERY = `*[_type == "news"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  image,
  badge,
  publishedAt,
  description
}`

// Single news article query
export const NEWS_ARTICLE_QUERY = `*[_type == "news" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  image,
  badge,
  publishedAt,
  description,
  body[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  },
  author,
  readTime
}`

// Related news query
export const RELATED_NEWS_QUERY = `*[_type == "news" && slug.current != $slug] | order(publishedAt desc) [0...4] {
  _id,
  title,
  "slug": slug.current,
  image,
  badge,
  publishedAt,
  description
}`

// Players queries
export const PLAYERS_QUERY = `*[_type == "player"] | order(number asc) {
  _id,
  firstName,
  lastName,
  number,
  position,
  image,
  stats,
  "slug": slug.current
}`

// Single player query (handles both slug and _id)
export const PLAYER_QUERY = `*[_type == "player" && (slug.current == $slug || _id == $slug)][0] {
  _id,
  firstName,
  lastName,
  number,
  position,
  image,
  stats,
  "slug": slug.current,
  bio[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  },
  placeOfBirth,
  dateOfBirth,
  height,
  weight,
  honours
}`

// Related players query (same position, excluding current player)
export const RELATED_PLAYERS_QUERY = `*[_type == "player" && (slug.current != $slug && _id != $slug) && position == $position] | order(number asc) [0...4] {
  _id,
  firstName,
  lastName,
  number,
  position,
  image,
  "slug": slug.current
}`

// Matches queries
export const MATCHES_QUERY = `*[_type == "match"] | order(date asc) [0...3] {
  _id,
  homeTeam,
  awayTeam,
  "homeCrest": homeCrest.asset->url,
  "awayCrest": awayCrest.asset->url,
  competition,
  "competitionLogo": competitionLogo.asset->url,
  date,
  event,
  venue,
  hasTickets
}`

// Stories queries
export const STORIES_QUERY = `*[_type == "story"] | order(_createdAt desc) {
  _id,
  title,
  coverImage,
  isNew,
  media[] {
    _key,
    _type,
    caption,
    duration,
    "image": image.asset->url,
    "video": video.asset->url,
    "poster": poster.asset->url
  }
}`

// Partners queries
export const PARTNERS_QUERY = `*[_type == "partner" && isActive == true] | order(order asc, name asc) {
  _id,
  name,
  "logo": logo.asset->url,
  url,
  category
}`

// Main partners query (for homepage)
export const MAIN_PARTNERS_QUERY = `*[_type == "partner" && isActive == true && category == "main"] | order(order asc, name asc) {
  _id,
  name,
  "logo": logo.asset->url,
  url,
  category
}`

// Standings queries
export const STANDINGS_QUERY = `*[_type == "standing" && competition == $competition && season == $season][0] {
  _id,
  season,
  competition,
  teams[] {
    position,
    teamName,
    "teamLogo": teamLogo.asset->url,
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    points,
    form
  }
}`

export const STANDINGS_SEASONS_QUERY = `*[_type == "standing" && competition == $competition] | order(season desc) {
  season
}`

// Photos queries
export const PHOTOS_QUERY = `*[_type == "photo"] | order(date desc) {
  _id,
  title,
  "coverImage": coverImage.asset->url,
  category,
  date,
  "slug": slug.current,
  "photoCount": count(images),
  images[] {
    "url": asset->url,
    alt,
    caption
  }
}`

export const PHOTO_QUERY = `*[_type == "photo" && slug.current == $slug][0] {
  _id,
  title,
  "coverImage": coverImage.asset->url,
  category,
  date,
  "slug": slug.current,
  images[] {
    "url": asset->url,
    alt,
    caption
  }
}`

// Trophies queries
export const TROPHIES_QUERY = `*[_type == "trophy"] | order(name asc) {
  _id,
  name,
  total
}`

