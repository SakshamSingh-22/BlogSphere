
import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <>
            <Navbar />

            <Routes>

                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:username" element={<Profile />} />

                {/* Protected pages */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/complete-profile"
                        element={<CompleteProfile />}
                    />

                    <Route
                        path="/create-post"
                        element={<CreatePost />}
                    />

                </Route>

                {/* Individual blog post */}
                <Route
                    path="/posts/:id"
                    element={<SinglePost />}
                />

            </Routes>
        </>
    );
}

export default App;
