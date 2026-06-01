import StoryCard from "./StoryCard";

export default function TrendingSection() {
  return (
    <section className="trending">
      <div className="section-header">
        <h2>Top Trending Series</h2>
        <span className="arrow">›</span>
      </div>

      <div className="trending-row">
        <StoryCard rank={1} title="The Curse of Loving You" rating="5.0" />
        <StoryCard rank={2} title="Contract Marriage" rating="4.9" />
        <StoryCard rank={3} title="The Last Gamble" rating="4.8" />
        <StoryCard rank={4} title="My Idiot Mafia" rating="4.8" />
        <StoryCard rank={5} title="The Dead Flower" rating="4.6" />
      </div>
    </section>
  );
}
