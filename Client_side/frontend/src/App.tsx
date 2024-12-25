import RoutesComponent from "@/routes.tsx";
import { AuthProvider } from "@/context/AuthContext.tsx";
function App() {
  return (
    <div>
      <AuthProvider>
        <RoutesComponent />
      </AuthProvider>
    </div>
  );
}

export default App;
