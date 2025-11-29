
import "./gray-button.style.css";
import { Button } from "primereact/button";

export const GrayButton = ({ children, ...props }: any) => {
  return (
    <Button className="gray-button" {...props}>
        {children}
    </Button>
  );
};
