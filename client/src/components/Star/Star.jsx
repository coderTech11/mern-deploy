import Rating from "@mui/material/Rating";

export default function Star({ stars }) {
  const ratingValue = stars !== undefined ? parseFloat(stars) : 0;

  return (
    <div className="w-full flex justify-start items-center my-1">
      <Rating
        name="read-only"
        value={ratingValue}
        readOnly
        size="small"
        precision={0.1}
      />
    </div>
  );
}
