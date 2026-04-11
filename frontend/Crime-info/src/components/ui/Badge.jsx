export default function Badge({ children, variant = "default" }) {
  const styles = {
    default: "bg-white/10 text-gray-300",
    success: "bg-green-500/10 text-green-400",
    danger: "bg-red-500/10 text-red-400",
    warning: "bg-yellow-500/10 text-yellow-400",
    info: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${styles[variant]}`}>
      {children}
    </span>
  );
}