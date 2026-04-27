import { useNavigate } from "react-router-dom";

function Games() {
  const navigate = useNavigate();

  const plans = [
    {
      id: 1,
      title: "1 Hour",
      hours: 1,
      actualPrice: 80,
      offerPrice: 80,
      description: "Best for quick gaming session",
    },
    {
      id: 2,
      title: "2 Hours",
      hours: 2,
      actualPrice: 160,
      offerPrice: 160,
      description: "Perfect for regular gameplay",
    },
    {
      id: 3,
      title: "3 Hours",
      hours: 3,
      actualPrice: 240,
      offerPrice: 225,
      description: "Actual ₹240, now only ₹225",
    },
    {
      id: 4,
      title: "5 Hours",
      hours: 5,
      actualPrice: 400,
      offerPrice: 375,
      description: "Actual ₹400, now only ₹375",
    },
    {
      id: 5,
      title: "10 Hours",
      hours: 10,
      actualPrice: 800,
      offerPrice: 700,
      description: "Actual ₹800, now only ₹700",
    },
    {
      id: 6,
      title: "10 Hours Day Pass",
      hours: 10,
      actualPrice: 800,
      offerPrice: 600,
      description: "Validity 1 day",
    },
  ];

  return (
    <div className="page">
      <h1 className="section-title">Choose Your Package</h1>

      <div className="game-grid">
        {plans.map((plan) => (
          <div className="game-card plan-card" key={plan.id}>
            <div className="game-card-body">
              <h3>{plan.title}</h3>

              <p>{plan.description}</p>

              {plan.actualPrice !== plan.offerPrice ? (
                <p className="price">
                  <span className="actual-price">₹{plan.actualPrice}</span>{" "}
                  <span>₹{plan.offerPrice}</span>
                </p>
              ) : (
                <p className="price">₹{plan.offerPrice}</p>
              )}

              <p className="package-hours">{plan.hours} Hour(s) Play Time</p>

              <button
                className="btn-primary"
                onClick={() => navigate(`/booking/${plan.id}`)}
              >
                Select Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;