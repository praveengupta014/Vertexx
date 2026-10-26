import { useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { track } from './store';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Home } from './pages/Home.jsx';
import { Explorer } from './pages/Explorer.jsx';
import { Detail } from './pages/Detail.jsx';
import { Company } from './pages/Company.jsx';
import { Inquiry } from './pages/Inquiry.jsx';
import { Insights } from './pages/Insights.jsx';
import { Clients } from './pages/Clients.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { News } from './pages/News.jsx';
import ChatWidget from './components/ChatWidget.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
const DetailRoute = () => { const { id } = useParams(); return <Detail key={id} id={id} />; };
const NewsRoute = () => { const { id } = useParams(); return <News key={id || 'list'} id={id} />; };

export default function App() {
  useEffect(() => { track('visit'); }, []);
  return (
    <HashRouter>
      <ScrollTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Explorer />} />
          <Route path="/services/:id" element={<DetailRoute />} />
          <Route path="/company" element={<Company />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsRoute />} />
          <Route path="/news/:id" element={<NewsRoute />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </HashRouter>
  );
}
