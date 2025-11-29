
import "./primary-button.style.css";
import { Button } from "primereact/button";

export const PrimaryButton = ({ children, ...props }: any) => {
  return (
    <Button className="primary-button" {...props}>
        {children}
    </Button>
  );
};
