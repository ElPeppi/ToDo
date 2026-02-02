import { useMemo, useState, useEffect } from "react";
import type { TaskInterface } from "../../interface/TaskInterface";
import { fetchWithAuth } from "../../services/authService";
import { handleLogout } from "../../utils/HandelLogout";
import "./calendar.css";

function toDayKey(date: Date) {
    // yyyy-mm-dd local
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function parseDueDateToLocalDayKey(dueDate: string) {
    // Si viene como "YYYY-MM-DD", new Date() puede interpretarlo como UTC.
    // Solución robusta: si es formato corto, parse manual.
    if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return dueDate;

    const dt = new Date(dueDate);
    return toDayKey(dt);
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfCalendarGrid(date: Date) {
    // Lunes como inicio (0=Domingo en JS)
    const first = startOfMonth(date);
    const day = first.getDay(); // 0 dom, 1 lun...
    const mondayIndex = (day + 6) % 7; // convierte para lunes=0
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - mondayIndex);
    return gridStart;
}

function buildCalendarDays(viewDate: Date) {
    const gridStart = startOfCalendarGrid(viewDate);
    const last = endOfMonth(viewDate);

    // 6 semanas * 7 días = 42 celdas (estándar)
    const days: Date[] = [];
    const cursor = new Date(gridStart);

    for (let i = 0; i < 42; i++) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    // opcional: podrías recortar semanas si quieres, pero 42 es simple.
    return { days, monthStart: startOfMonth(viewDate), monthEnd: last };
}

function getTaskColor(task: TaskInterface) {
    // Define colores por prioridad/estado/grupo
    if (task.status === "completed") return "task task--done";
    if (task.status === "overdue") return "task task--overdue";
    if (task.priority === "high") return "task task--high";
    if (task.priority === "medium") return "task task--medium";
    return "task task--low";
}
export default function Calendar({ setPopup }: { setPopup: Function }) {
    const [tasks, setTasks] = useState<TaskInterface[]>([]);
    useEffect(() => {
        document.documentElement.setAttribute("data-page", "calendar");
        const fetchTasks = async () => {
            try {
                const response = await fetchWithAuth("/api/tasks");
                const data = await response.json();

                if (response.ok) setTasks(data);
                else setPopup({ message: "Error al cargar tareas", type: "error" });
            } catch (error) {
                console.error(error);
                setPopup({ message: "Sesión expirada", type: "info" });
                handleLogout();
            }
        };

        fetchTasks();
    }, []);

    const [viewDate, setViewDate] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const tasksByDay = useMemo(() => {
        const map = new Map<string, TaskInterface[]>();
        for (const t of tasks) {
            const key = parseDueDateToLocalDayKey(t.dueDate);
            const arr = map.get(key) ?? [];
            arr.push(t);
            map.set(key, arr);
        }
        // Ordena por prioridad o por título si quieres
        for (const [k, arr] of map.entries()) {
            arr.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
            map.set(k, arr);
        }
        return map;
    }, [tasks]);

    const { days, monthStart } = useMemo(() => buildCalendarDays(viewDate), [viewDate]);
    const viewMonthLabel = useMemo(() => {
        return viewDate.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
    }, [viewDate]);

    const todayKey = toDayKey(new Date());

    const openDay = (key: string) => setSelectedDay(key);
    const closeDay = () => setSelectedDay(null);

    const selectedTasks = selectedDay ? tasksByDay.get(selectedDay) ?? [] : [];

    const goPrevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goNextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    const goToday = () => setViewDate(new Date());

    return (
        <div className="cal">
            <div className="cal__header">
                <div className="cal__title">{viewMonthLabel}</div>
                <div className="cal__actions">
                    <button onClick={goPrevMonth}>◀</button>
                    <button onClick={goToday}>Hoy</button>
                    <button onClick={goNextMonth}>▶</button>
                </div>
            </div>

            <div className="cal__weekdays">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
                    <div key={d} className="cal__weekday">{d}</div>
                ))}
            </div>

            <div className="cal__grid">
                {days.map((date) => {
                    const key = toDayKey(date);
                    const inMonth = date.getMonth() === monthStart.getMonth();
                    const isToday = key === todayKey;

                    const dayTasks = tasksByDay.get(key) ?? [];
                    const maxVisible = 3;
                    const visible = dayTasks.slice(0, maxVisible);
                    const extra = dayTasks.length - visible.length;

                    return (
                        <div
                            key={key}
                            className={[
                                "cal__cell",
                                inMonth ? "cal__cell--inMonth" : "cal__cell--outMonth",
                                isToday ? "cal__cell--today" : "",
                            ].join(" ")}
                            onClick={() => openDay(key)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="cal__cellTop">
                                <span className="cal__dayNum">{date.getDate()}</span>
                            </div>

                            <div className="cal__tasks">
                                {visible.map(t => (
                                    <div key={t.id} className={getTaskColor(t)} title={t.title}>
                                        {t.title}
                                    </div>
                                ))}
                                {extra > 0 && (
                                    <div className="cal__more">+{extra} más</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div className="cal__modalBackdrop" onClick={closeDay}>
                    <div className="cal__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cal__modalHeader">
                            <div className="cal__modalTitle">Tareas para {selectedDay}</div>
                            <button onClick={closeDay}>✕</button>
                        </div>

                        {selectedTasks.length === 0 ? (
                            <div className="cal__empty">No hay tareas este día.</div>
                        ) : (
                            <div className="cal__modalList">
                                {selectedTasks.map(t => (
                                    <div key={t.id} className="cal__modalItem">
                                        <span className={getTaskColor(t)} style={{ display: "inline-block" }}>
                                            {t.title}
                                        </span>
                                        <span className="cal__status">{t.status ?? "pending"}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}