/*
 * The premise of the parser is to normalize some free form text coming from
 * hacker news. We want to take some string thats posted from the 'who wants to
 * be hired' threads like https://news.ycombinator.com/item?id=24969522 and
 * extract some metadata.
 *
 * I've implemented this in a different repo pretty naively but I think a
 * parser/combinator would be more robust. The place where I'm really failing is
 * the `takeWhile` call because the function only gives 1 character to match on
 * when I really just want to match on <p> tags or really a selection of
 * different separators.
*/

const P = require('parsimmon')

const string =
  'Location: Seattle<p>Remote: Yes<p>Willing to relocate: No<p>Technologies: React, Vue, jQuery, HTML5, CSS3&#x2F;SCSS, Node, UI Design<p>Email: iamgrimus@gmail.com<p>Resume: <a href="https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;r-dbl-l&#x2F;" rel="nofollow">https:&#x2F;&#x2F;www.linkedin.com&#x2F;in&#x2F;r-dbl-l&#x2F;</a><p>Website: <a href="https:&#x2F;&#x2F;github.com&#x2F;IamGrimUs" rel="nofollow">https:&#x2F;&#x2F;github.com&#x2F;IamGrimUs</a><p>Hello friends I am a life long learner with a design background and a front end web development focus. I have 13 years of experience in many hybrid roles incorporating design and development. I&#x27;ve worked for both start up creative agencies and consulting firms as well as very established in house teams. I have extensive CSS&#x2F;HTML skills from years of email development and a hunger to join a software development team to work with technologies like React or Vue full time. I am open to any and all opportunities, FTE, PTE, contract.<p>I look forward to connecting with you.<p>Cheers, \nRussell'


const SeperatorParser = P.alt(P.string(':'), P.string('<'), P.string(' '))

const RelocateParser = P.seq(
  P.alt(P.regexp(/relocate/i)),
  SeperatorParser,
  P.takeWhile((c) => {
    return c !== '<'
  }),
).map((item) => {
  return {
    relocate: item[2].trim(),
  }
})

const EmailParser = P.seq(
  P.alt(P.regexp(/email/i)),
  SeperatorParser,
  P.takeWhile((c) => {
    return c !== '<'
  }),
).map((item) => {
  return {
    email: item[2].trim(),
  }
})

const ResumeParser = P.seq(
  P.alt(P.regexp(/resume/i)),
  SeperatorParser,
  P.takeWhile((c) => {
    return c !== '<'
  }),
).map((item) => {
  return {
    resume: item[2].trim(),
  }
})

const TechnologiesParser = P.seq(
  P.alt(P.regexp(/technologies/i)),
  SeperatorParser,
  P.takeWhile((c) => {
    return c !== '<'
  }),
).map((item) => {
  return {
    technologies: item[2].trim(),
  }
})

const LocationParser = P.seq(
  P.alt(P.regexp(/location/i)),
  SeperatorParser,
  P.takeWhile((c) => {
    return c !== '<'
  }),
).map((item) => {
  return {
    location: item[2].trim(),
  }
})

const RemoteParser = P.seq(
  P.alt(P.regexp(/remote/i)),
  SeperatorParser,
  P.takeWhile((c) => {
    return c !== '<'
  }),
).map((item) => {
  return {
    remote: item[2].trim(),
  }
})

const KeywordsParser = P.alt(
  LocationParser,
  RemoteParser,
  RelocateParser,
  TechnologiesParser,
  ResumeParser,
  EmailParser,
  P.any,
)

const parser = P.seq(KeywordsParser.many(), P.all)
const result = parser.parse(string).value[0].filter(i => typeof i === 'object')

console.log(result)
