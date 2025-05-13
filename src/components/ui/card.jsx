export function Card({ children }) {
    return <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">{children}</div>
  }
  
  export function CardContent({ children }) {
    return <div className="text-gray-800 dark:text-white">{children}</div>
  }