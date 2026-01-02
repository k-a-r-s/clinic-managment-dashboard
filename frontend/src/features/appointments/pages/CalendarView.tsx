import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import type { Appointment } from "../../../types";
import { getAppointments } from "../api/appointments.api";
import { toast } from "react-hot-toast";

// appointments fetched from API
// stored in state below

interface CalendarViewProps {
  onViewAppointment?: (appointmentId: string) => void;
  onCreate?: () => void;
  onBackToList?: () => void;
}

export function CalendarView({
  onViewAppointment,
  onCreate,
  onBackToList,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
        toast.error("Failed to load appointments");
      }
    };

    void loadAppointments();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => {
      const aptDate = (apt as any).appointmentDate || (apt as any).date;
      return aptDate?.toString().split("T")[0] === dateStr;
    });
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const changeWeek = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + increment * 7);
    setCurrentDate(newDate);
  };

  const changeDay = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + increment);
    setCurrentDate(newDate);
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const currentDay = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const getAppointmentsForDateTime = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => {
      const aptDate = (apt as any).appointmentDate || (apt as any).date;
      const aptDateStr = aptDate?.toString().split("T")[0];

      // For now, check if appointment is on the same date
      // In a real app, you'd also check the time
      return aptDateStr === dateStr;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = getWeekDays(currentDate);
  const timeSlots = getTimeSlots();
  const weekRange = `${weekDays[0].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${weekDays[6].toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
  const dayName = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderMonthView = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      );
      const appointments = isValidDay ? getAppointmentsForDate(date) : [];
      const isToday =
        isValidDay && date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={i}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isValidDay ? "bg-white hover:bg-gray-50" : "bg-gray-50"
          } ${isToday ? "ring-2 ring-[#1C8CA8]" : ""}`}
        >
          {isValidDay && (
            <>
              <div
                className={`text-sm font-medium mb-2 ${
                  isToday ? "text-[#1C8CA8]" : "text-gray-700"
                }`}
              >
                {dayNumber}
              </div>
              <div className="space-y-1">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() =>
                      onViewAppointment && onViewAppointment(apt.id)
                    }
                    className="text-xs p-1 rounded bg-[#1C8CA8] text-white cursor-pointer hover:bg-[#157A93] truncate"
                  >
                    <div className="font-medium">
                      {apt.patient
                        ? `${apt.patient.firstName} ${apt.patient.lastName}`
                        : "N/A"}
                    </div>
                    <div className="text-[10px] opacity-90">
                      {apt.doctor
                        ? `${apt.doctor.firstName} ${apt.doctor.lastName}`
                        : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-2 text-sm font-medium text-gray-600 border-r border-gray-200">
              Time
            </div>
            {weekDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={index}
                  className={`p-2 text-center border-r border-gray-200 ${
                    isToday ? "bg-teal-50" : ""
                  }`}
                >
                  <div
                    className={`text-xs ${
                      isToday ? "text-teal-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      isToday ? "text-teal-600" : "text-gray-900"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          {timeSlots.map((time, timeIndex) => {
            const hour = parseInt(time.split(":")[0]);
            return (
              <div
                key={time}
                className="grid grid-cols-8 border-b border-gray-200"
              >
                <div className="p-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
                  {time}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const appointments = getAppointmentsForDateTime(day, hour);
                  const isToday =
                    day.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={dayIndex}
                      className={`p-1 min-h-[60px] border-r border-gray-200 ${
                        isToday ? "bg-teal-50/30" : "bg-white"
                      } hover:bg-gray-50`}
                    >
                      {appointments.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() =>
                            onViewAppointment && onViewAppointment(apt.id)
                          }
                          className="text-xs p-2 mb-1 rounded bg-[#1C8CA8] text-white cursor-pointer hover:bg-[#157A93]"
                        >
                          <div className="font-medium truncate">
                            {apt.patient
                              ? `${apt.patient.firstName} ${apt.patient.lastName}`
                              : "N/A"}
                          </div>
                          <div className="text-[10px] opacity-90 truncate">
                            Dr.{" "}
                            {apt.doctor
                              ? `${apt.doctor.firstName} ${apt.doctor.lastName}`
                              : "N/A"}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);

    return (
      <div className="max-w-4xl mx-auto">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {timeSlots.map((time, index) => {
            const hour = parseInt(time.split(":")[0]);
            const appointmentsAtTime = dayAppointments.filter((apt) => {
              // In a real app, you'd check the actual appointment time
              // For now, distribute them across the day
              return true;
            });

            return (
              <div
                key={time}
                className="grid grid-cols-[100px_1fr] border-b border-gray-200 last:border-b-0"
              >
                <div className="p-4 text-sm text-gray-500 border-r border-gray-200 bg-gray-50">
                  {time}
                </div>
                <div className="p-2 min-h-[80px] bg-white hover:bg-gray-50">
                  {index === 2 &&
                    dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() =>
                          onViewAppointment && onViewAppointment(apt.id)
                        }
                        className="mb-2 p-3 rounded-lg bg-[#1C8CA8] text-white cursor-pointer hover:bg-[#157A93] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">
                            {apt.patient
                              ? `${apt.patient.firstName} ${apt.patient.lastName}`
                              : "N/A"}
                          </span>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="text-sm opacity-90">
                          <div>
                            Doctor:{" "}
                            {apt.doctor
                              ? `${apt.doctor.firstName} ${apt.doctor.lastName}`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                  {index === 5 &&
                    dayAppointments.slice(2).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() =>
                          onViewAppointment && onViewAppointment(apt.id)
                        }
                        className="mb-2 p-3 rounded-lg bg-[#1C8CA8] text-white cursor-pointer hover:bg-[#157A93] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">
                            {apt.patient
                              ? `${apt.patient.firstName} ${apt.patient.lastName}`
                              : "N/A"}
                          </span>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="text-sm opacity-90">
                          <div>
                            Doctor:{" "}
                            {apt.doctor
                              ? `${apt.doctor.firstName} ${apt.doctor.lastName}`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {dayAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No appointments scheduled for this day
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101828] text-base font-normal">
            Appointments Calendar
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onBackToList}
            variant="outline"
            className="gap-2 bg-white border-gray-200"
          >
            <CalendarIcon className="w-4 h-4" />
            List View
          </Button>
          <Button
            onClick={onCreate}
            className="gap-2 bg-[#1C8CA8] hover:bg-[#157A93]"
          >
            <Plus className="w-4 h-4" />
            Create Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (view === "month") changeMonth(-1);
                else if (view === "week") changeWeek(-1);
                else changeDay(-1);
              }}
              className="border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 min-w-[250px] text-center">
              {view === "month" && monthName}
              {view === "week" && weekRange}
              {view === "day" && dayName}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (view === "month") changeMonth(1);
                else if (view === "week") changeWeek(1);
                else changeDay(1);
              }}
              className="border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="border-gray-200"
            >
              Today
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
              className={
                view === "month"
                  ? "bg-[#1C8CA8] hover:bg-[#157A93]"
                  : "border-gray-200"
              }
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
              className={
                view === "week"
                  ? "bg-[#1C8CA8] hover:bg-[#157A93]"
                  : "border-gray-200"
              }
            >
              Week
            </Button>
            <Button
              variant={view === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("day")}
              className={
                view === "day"
                  ? "bg-[#1C8CA8] hover:bg-[#157A93]"
                  : "border-gray-200"
              }
            >
              Day
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        {view === "month" && (
          <div className="p-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0">{renderMonthView()}</div>
          </div>
        )}

        {view === "week" && <div className="p-4">{renderWeekView()}</div>}

        {view === "day" && <div className="p-4">{renderDayView()}</div>}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Status Legend
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              Scheduled
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
              Completed
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
              Canceled
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
