import { useEffect, useState } from "react";
import "../../styles/ScheduleCalendar.css";

const STORAGE_KEY = "finance-calendar-schedules";

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function ScheduleCalendar() {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );
    const [selectedDate, setSelectedDate] = useState(toDateKey(today));
    const [schedules, setSchedules] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );
        } catch {
            return [];
        }
    });
    const [view, setView] = useState("calendar");
    const [scheduleTitle, setScheduleTitle] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [isAddingSchedule, setIsAddingSchedule] = useState(false);
    const [touchStart, setTouchStart] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    }, [schedules]);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = currentMonth.toLocaleDateString("en-PH", {
        month: "long",
        year: "numeric"
    });

    const calendarDays = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
    ];

    while (calendarDays.length % 7 !== 0) {
        calendarDays.push(null);
    }

    const selectedSchedules = schedules
        .filter(schedule => schedule.date === selectedDate)
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

    const formattedSelectedDate = new Date(
        `${selectedDate}T12:00:00`
    ).toLocaleDateString("en-PH", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });

    function changeMonth(offset) {
        setCurrentMonth(new Date(year, month + offset, 1));
    }

    function selectDate(dateKey) {
        setSelectedDate(dateKey);
        setIsAddingSchedule(false);
    }

    function addSchedule(event) {
        event.preventDefault();

        const title = scheduleTitle.trim();

        if (!title) return;

        setSchedules(previous => [
            ...previous,
            {
                id: crypto.randomUUID(),
                date: selectedDate,
                title,
                time: scheduleTime
            }
        ]);

        setScheduleTitle("");
        setScheduleTime("");
        setIsAddingSchedule(false);
    }

    function deleteSchedule(id) {
        setSchedules(previous =>
            previous.filter(schedule => schedule.id !== id)
        );
    }

    function handleTouchStart(event) {
        setTouchStart(event.changedTouches[0].clientX);
    }

    function handleTouchEnd(event) {
        if (touchStart === null) return;

        const distance =
            event.changedTouches[0].clientX - touchStart;

        if (Math.abs(distance) > 60) {
            setView(distance < 0 ? "schedule" : "calendar");
            setIsAddingSchedule(false);
        }

        setTouchStart(null);
    }

    return (
        <section
            className="schedule-calendar"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <header className="schedule-calendar-header">           

                <div className="calendar-view-controls">
                    <button
                        type="button"
                        className={view === "calendar" ? "active" : ""}
                        onClick={() => {
                            setView("calendar");
                            setIsAddingSchedule(false);
                        }}
                        aria-label="Show monthly view"
                        aria-pressed={view === "calendar"}
                    >
                        <span>▦</span>
                    </button>

                    <button
                        type="button"
                        className={view === "schedule" ? "active" : ""}
                        onClick={() => setView("schedule")}
                        aria-label="Show daily events"
                        aria-pressed={view === "schedule"}
                    >
                        <span>☷</span>
                    </button>
                </div>
            </header>

            <div className="calendar-viewport">
                <div
                    className={`calendar-views ${view === "schedule" ? "show-schedule" : ""
                        }`}
                >
                    <div className="calendar-view calendar-month-view">
                        <div className="calendar-month-navigation">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                aria-label="Previous month"
                            >
                                ‹
                            </button>

                            <strong>{monthName}</strong>

                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                aria-label="Next month"
                            >
                                ›
                            </button>
                        </div>

                        <div className="compact-calendar-grid">
                            {["M", "T", "W", "T", "F", "S", "S"].map(
                                (day, index) => (
                                    <span
                                        className="compact-weekday"
                                        key={`${day}-${index}`}
                                    >
                                        {day}
                                    </span>
                                )
                            )}

                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return (
                                        <span
                                            className="compact-calendar-blank"
                                            key={`blank-${index}`}
                                        />
                                    );
                                }

                                const dateKey = toDateKey(
                                    new Date(year, month, day)
                                );

                                const hasSchedule = schedules.some(
                                    schedule => schedule.date === dateKey
                                );

                                return (
                                    <button
                                        type="button"
                                        key={dateKey}
                                        className={[
                                            "compact-calendar-day",
                                            selectedDate === dateKey
                                                ? "selected"
                                                : "",
                                            toDateKey(new Date()) === dateKey
                                                ? "today"
                                                : "",
                                            hasSchedule ? "has-schedule" : ""
                                        ].filter(Boolean).join(" ")}
                                        onClick={() => selectDate(dateKey)}
                                        aria-pressed={selectedDate === dateKey}
                                        aria-label={`${dateKey}${hasSchedule ? ", has schedule" : ""
                                            }`}
                                    >
                                        <span>{day}</span>

                                        {hasSchedule && (
                                            <span className="compact-schedule-dot" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="calendar-view daily-schedule-view">
                        <div className="daily-schedule-heading">
                            <button
                                type="button"
                                className="back-to-calendar"
                                onClick={() => {
                                    setView("calendar");
                                    setIsAddingSchedule(false);
                                }}
                            >
                                ‹ Back
                            </button>

                            <span className="daily-schedule-date">
                                {formattedSelectedDate}
                            </span>

                            <h3>Daily Schedule</h3>
                        </div>

                        {selectedSchedules.length > 0 ? (
                            <div className="daily-schedule-list">
                                {selectedSchedules.map((schedule, index) => (
                                    <article
                                        className="daily-schedule-event"
                                        key={schedule.id}
                                    >
                                        <span className="event-timeline">
                                            <span />
                                            {index < selectedSchedules.length - 1 && (
                                                <span className="event-timeline-line" />
                                            )}
                                        </span>

                                        <div className="daily-event-content">
                                            <strong>{schedule.title}</strong>
                                            <span>
                                                {schedule.time || "Time not set"}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="remove-event"
                                            aria-label={`Remove ${schedule.title}`}
                                            onClick={() => deleteSchedule(schedule.id)}
                                        >
                                            ×
                                        </button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="daily-schedule-empty">
                                <span className="empty-calendar-icon">▦</span>

                                <strong>
                                    {selectedDate === toDateKey(new Date())
                                        ? "No schedule for today"
                                        : "No schedule for this day"}
                                </strong>

                                <p>
                                    Your day is clear. Add an event whenever
                                    you need to.
                                </p>
                            </div>
                        )}

                        {isAddingSchedule ? (
                            <form
                                className="compact-schedule-form daily-schedule-form"
                                onSubmit={addSchedule}
                            >
                                <input
                                    value={scheduleTitle}
                                    onChange={event =>
                                        setScheduleTitle(event.target.value)
                                    }
                                    placeholder="Schedule title"
                                    aria-label="Schedule title"
                                    maxLength={100}
                                    required
                                    autoFocus
                                />

                                <input
                                    type="time"
                                    value={scheduleTime}
                                    onChange={event =>
                                        setScheduleTime(event.target.value)
                                    }
                                    aria-label="Schedule time"
                                />

                                <button type="submit" aria-label="Save schedule">
                                    ✓
                                </button>

                                <button
                                    type="button"
                                    aria-label="Cancel adding schedule"
                                    onClick={() => {
                                        setIsAddingSchedule(false);
                                        setScheduleTitle("");
                                        setScheduleTime("");
                                    }}
                                >
                                    ×
                                </button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                className="add-daily-schedule"
                                onClick={() => setIsAddingSchedule(true)}
                            >
                                + Add Schedule
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <footer className="calendar-view-footer">
                <span className={`calendar-page-indicator ${view === "schedule" ? "schedule-active" : ""
                    }`}>
                    <span className={view === "calendar" ? "active" : ""} />
                    <span className={view === "schedule" ? "active" : ""} />
                </span>
            </footer>
        </section>
    );
}

export default ScheduleCalendar;