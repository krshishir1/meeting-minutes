"use client";
import Image from "next/image";

export default function Images({ data }: { data: any }) {
    const dataImg = data.visual_moments;
  return (
    <>
      {dataImg.length > 0 ? (
        <div>
            {dataImg.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between mb-6 p-6 border rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-1/2 p-4 text-left space-y-4">
                <h2 className="text-xl font-semibold">
                  Start Time: {item.start_time}
                </h2>
                <h2 className="text-xl font-semibold">
                  End Time: {item.end_time}
                </h2>
                <h3 className="text-xl font-semibold">
                  Importance:{" "}
                  <span
                    className={`${
                      item.importance === "low"
                        ? "text-green-500"
                        : item.importance === "medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                    } font-semibold capitalize`}
                  >
                    {item.importance}
                  </span>
                </h3>
                <p className="text-lg">
                  <span className="text-xl font-semibold">Reason:</span>{" "}
                  <span>{item.reason}</span>
                </p>
              </div>
              <div className="relative group rounded-lg w-120 h-fit overflow-hidden">
                <Image
                  src={item.screenshot_url}
                  alt={item.expected_visual || "Visual Moment"}
                  width={400}
                  height={200}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 opacity-0 group-hover:opacity-70 flex items-center justify-center transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold p-4">
                    {item.expected_visual}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
            
      ):(
        <div>no images available</div>
      )}
    </>
  );
}
