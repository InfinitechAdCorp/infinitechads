

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    color?: "blue" | "red";
}

const Button: React.FC<ButtonProps> = ({ onClick, children, color = "blue" }) => {
    const baseStyles = "text-white w-20 rounded-lg text-sm py-1 me-2";
    const colorStyles =
        color === "blue"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-red-600 hover:bg-red-700";

    return (
        <button onClick={onClick} className={`${baseStyles} ${colorStyles}`}>
            {children}
        </button>
    );
};

export default Button;