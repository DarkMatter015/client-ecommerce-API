
import "./secondary-button.style.css";
import { Button } from "primereact/button";

export const SecondaryButton = ({ children, ...props }: any) => {
  return (
    <Button className="secondary-button" {...props}>
        {children}
    </Button>
  );
};
