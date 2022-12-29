import { useCallback, useState, useEffect } from "react";
import { BiArchive } from "react-icons/bi";
import AddAppointment from "./components/AddAppointment";
import { AppointmentInfo } from "./components/AppointmentInfo";
import { Search } from "./components/Search";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        appointment.petName.toLowerCase().includes(query) ||
        appointment.aptNotes.toLowerCase().includes(query) ||
        appointment.ownerName.toLowerCase().includes(query)
    )
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  const getAppointments = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => setAppointments(data));
  }, []);
  useEffect(() => {
    getAppointments();
  }, [getAppointments]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl">
        <BiArchive className="inline-block text-red-500 align-top" />
        Appointments App
      </h1>
      <AddAppointment
        addNewAppointment={(appointment) =>
          setAppointments([...appointments, appointment])
        }
        lastId={appointments.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
      />
      <Search
        queryAppointments={(value) => setQuery(value)}
        sortBy={sortBy}
        onSortBy={(sortType) => setSortBy(sortType)}
        orderBy={orderBy}
        onOrderBy={(orderType) => setOrderBy(orderType)}
      />
      <ul className="divide-y">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(id) =>
              setAppointments(
                appointments.filter((appointment) => appointment.id !== id)
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
