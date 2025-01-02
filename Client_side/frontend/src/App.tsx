import RoutesComponent from "@/routes.tsx";
import { AuthProvider } from "@/context/AuthContext.tsx";
import Header from "@/components/Header.tsx";
function App() {
  return (
    <div>
      <AuthProvider>
        <Header />
        <RoutesComponent />
      </AuthProvider>
    </div>
  );
}

export default App;
