// import "../../style.css";
const Shimmer = () => {
  const shimmerArray = new Array(20).fill(0);

  return (
    <div className="shimmer-container" data-testid="shimmer">
      {shimmerArray.map((_, index) => (
        <div className="shimmer-card" key={index} />
      ))}
    </div>
  );
};
export default Shimmer;
