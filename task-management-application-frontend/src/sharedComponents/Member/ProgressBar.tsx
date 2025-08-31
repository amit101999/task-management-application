import { useEffect, useState } from "react";

interface propTye{
    percentage: number,
    delay: number
}
const ProgressBar = ({percentage, delay}  : propTye) => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, delay);
      return () => clearTimeout(timer);
    }, [percentage, delay]);
  return (
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${width}%` }}
            />
          </div>
        );
      };

export default ProgressBar