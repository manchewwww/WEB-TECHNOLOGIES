"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const API_URL = 'http://localhost:3000'; // Your API URL here
function MultipleTicketsPage() {
    const [tickets, setTickets] = (0, react_1.useState)([]); // Explicitly set the type for tickets
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [sortBy, setSortBy] = (0, react_1.useState)('project');
    (0, react_1.useEffect)(() => {
        function fetchTickets() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${API_URL}/ticket`);
                    const data = yield response.json();
                    setTickets(data);
                }
                catch (error) {
                    console.error('Грешка при зареждане на билетите:', error);
                }
                finally {
                    setLoading(false);
                }
            });
        }
        fetchTickets();
    }, []);
    const sortedTickets = [...tickets].sort((a, b) => {
        if (sortBy === 'project') {
            return a.projectId.localeCompare(b.projectId);
        }
        else if (sortBy === 'assignee') {
            return (a.assignee || '').localeCompare(b.assignee || '');
        }
        else if (sortBy === 'status') {
            return a.status.localeCompare(b.status);
        }
        else {
            return 0;
        }
    });
    if (loading) {
        return <div>Зареждане на билети...</div>;
    }
    return (<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Списък с билети</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Сортирай по: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="project">Проект</option>
          <option value="assignee">Потребител</option>
          <option value="status">Статус</option>
        </select>
      </div>

      <div>
        {sortedTickets.map((ticket) => (<div key={ticket.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <h3>{ticket.title}</h3>
            <p><strong>Описание:</strong> {ticket.description}</p>
            <p><strong>Статус:</strong> {ticket.status}</p>
            <p><strong>Проект ID:</strong> {ticket.projectId}</p>
            <p><strong>Възложен на (ID):</strong> {ticket.assignee || 'Не е зададен'}</p>
            <p><small>Създаден на: {new Date(ticket.createdAt).toLocaleDateString()}</small></p>
          </div>))}
      </div>
    </div>);
}
exports.default = MultipleTicketsPage;
