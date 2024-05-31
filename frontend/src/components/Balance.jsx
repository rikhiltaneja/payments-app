export const Balance = ({ value }) => {
  return (
    <div className="flex">
      <div className="font-bold text-lg">
        Your balance - <span className="font-normal">{value}</span>
      </div>
    </div>
  );
};
