"use client"
import Image from "next/image";
export default function Images({ data }: { data: any }){
    return (
        <>
        {/* v */}
        {data.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-around mb-4 p-4 border rounded-lg shadow-md bg-white">
                <div className="w-1/2 p-4 text-left">
                    <h2 className="text-xl font-semibold">StartTime: {item.start_time}</h2>
                    <h2 className="text-xl font-semibold">EndTime: {item.end_time}</h2>
                    <h3 className="text-xl font-semibold">Importance: <span className={`${item.importance === "low" ? "text-green-500" : item.importance=== "medium"? "text-yellow-500":"text-red-500"} font-semibold capitalize` }>{item.importance}</span></h3>
                    <p className=""><span className="text-xl font-semibold">Reason:</span> <span>{item.reason}</span></p>
                    </div>
                    <div className="relative group rounded-lg w-120 h-fit">
  <Image
    src={item.screenshot_url}
    alt="Visual Moment"
    width={400}
    height={200}
    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-90"
  />
  <div className="absolute inset-0 bg-black bg-opacity-0 opacity-0 group-hover:opacity-70 flex items-center justify-center transition-opacity duration-300">
    <p className="text-white text-lg font-semibold p-2">{item.expected_visual}</p>
  </div>
</div>
</div>

            
        ))}
        </>
    )
}