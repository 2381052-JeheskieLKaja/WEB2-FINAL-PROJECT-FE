// eventData.ts

export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    image: string;
    price: number;
    category: string;
  }
  
  export const eventList: Event[] = [
    {
      id: 1,
      name: "Fun Run 2025",
      description: "Scenic fun run with prizes.",
      date: "2025-05-20T08:00:00",
      location: "Central Park, Jakarta",
      image: "https://forum.nsra.org.uk/attachment.php?attachmentid=62622&d=1722290342",
      price: 100,
      category: "Running",
    },
    {
      id: 2,
      name: "Marathon Indonesia 2025",
      description: "Challenging marathon race.",
      date: "2025-06-10T07:00:00",
      location: "Bali, Indonesia",
      image: "https://www.ticket2u.id/ticket2u/site/news/assets/img/2025/marathon-id.png",
      price: 150,
      category: "Running",
    },
    {
      id: 3,
      name: "Yoga Retreat 2025",
      description: "Relaxing yoga retreat.",
      date: "2025-07-15T09:00:00",
      location: "Ubud, Bali",
      image: "https://sparkmembership.com/wp-content/smush-webp/2024/12/How-to-Host-a-Yoga-Retreat-in-2025.png.webp",
      price: 200,
      category: "Wellness",
    },
    {
      id: 4,
      name: "Trail Run 2025",
      description: "Trail run with scenic views.",
      date: "2025-08-22T06:00:00",
      location: "Bandung, West Java",
      image: "https://jadwallari.id/wp-content/uploads/2024/12/Indofest-Fun-Trail-Running.jpg",
      price: 80,
      category: "Cycling",
    },
  ];
  
  export const getEventById = (id: number): Event | undefined => {
    return eventList.find((event) => event.id === id);
  };
  