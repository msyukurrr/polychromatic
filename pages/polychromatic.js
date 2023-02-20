import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function Polychromatic() {
  const [image, setImage] = useState([]);
  const [images, setImages] = useState([]);
  const [time, setTime] = useState("time loading...");
  const [date, setDate] = useState("date loading...");
  const [coords, setCoords] = useState({});

  const apiKey = process.env.NEXT_PUBLIC_NAME;
  const url = `https://epic.gsfc.nasa.gov/api/natural?api_key=${apiKey}`;
  const getPolychromaticData = async () => {
    const res = await axios.get(url);
    const data = await res.data;
    console.log(data);

    const caption = data[0].caption;
    const date = data[0].date.split(" ")[0];
    const dateFormatted = date.replaceAll("-", "/");

    let times = [];
    let images = [];

    for (let i = 0; i < data.length; i++) {
      let time = data[i].date.split(" ")[1];
      let coords = data[i].centroid_coordinates;
      let image = `https://epic.gsfc.nasa.gov/archive/natural/${dateFormatted}/png/${data[i].image}.png`;

      times.push(time);
      images.push({
        image: image,
        time: time,
        coords: coords,
      });
    }

    setDate(date);
    setImages(images);
    setImage(images[0].image);
    setTime(times[0]);
    setCoords([images[0].coords.lat, images[0].coords.lon]);

    console.log(images);
  };

  useEffect(() => {
    getPolychromaticData();
  }, []);

  return (
    <div className="bg-blue-200">
      <h1 className="text-3xl font-bold text-center mb-8 py-4 text-lime-600">
        Polychromatic
      </h1>
      <div>
        <div className="flex flex-col items-center justify-center">
          <div className="bg-lime-600 rounded-lg shadow-lg p-4">
            <Image
              src={image}
              alt={image}
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          <div className="mt-5 text-center">
            <div className="font-medium">{time}</div>
            <div className="text-lime-500">
              {coords[0]}, {coords[1]}
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-lime-100 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lime-100 uppercase tracking-wider">
                Lattitude
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lime-100 uppercase tracking-wider">
                Longitude
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lime-100 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lime-100 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {images &&
              images.map((o, index) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap bg-blue-200">{o.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap bg-blue-200">
                      {o.coords.lat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap bg-blue-200">
                      {o.coords.lon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap bg-blue-200">
                      <Image
                        src={o.image}
                        alt={o.image}
                        width={100}
                        height={100}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap bg-blue-200">
                      <button
                        onClick={() => {
                          setImage(o.image);
                          setTime(o.time);
                          setCoords([o.coords.lat, o.coords.lon]);
                          document.body.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-lime-600 hover:bg-blue-700 text-black font-bold py-3 px-6 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
