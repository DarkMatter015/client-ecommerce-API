import "./card-feedback.style.css";

interface CardFeedbackProps {
    image: string;
    name: string;
    rating: string;
    text: string;
}

export const CardFeedback = ({
    image,
    name,
    rating,
    text,
}: CardFeedbackProps) => {
    return (
        <article className="card-feedback">
            <img className="feedback-image" src={image} alt="Cliente 1" />
            <div className="feedback-body">
                <strong>{name}</strong>
                <div className="feedback-rating" aria-hidden>
                    {rating}
                </div>
                <p>{text}</p>
            </div>
        </article>
    );
};
