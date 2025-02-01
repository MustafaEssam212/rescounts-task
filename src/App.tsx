import '@mui/material/styles';
import DataGridDemo from './components/DataGridDemo';
import DataGrid from './components/DataGridCustomized';
function App() {


  const columns = [
    { key: "id", label: "ID", width: 100, visible: true },
    { key: "name", label: "Name", width: 200, visible: true },
    { key: "email", label: "Email", width: 250, visible: true },
  ];
  
  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));

  return (
    <>
      <DataGridDemo />
      <DataGrid columns={columns} data={data} />
    </>
  )
}

export default App
