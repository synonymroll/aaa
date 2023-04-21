import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useDarkMode} from 'usehooks-ts';
import {Image, MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';

import ArnieDetails from './ArnieDetails';
import ArnieList from './ArnieList';
import Dashboard from './Dashboard';

export default function App() {
  const {isDarkMode} = useDarkMode();
  const colorScheme = isDarkMode ? 'dark' : 'light';
  return (
    <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="/" element={<Image src="./arnie.jpg" />} />
            <Route path="/arnies" element={<ArnieList />} />
            <Route path="/arnies/:id" element={<ArnieDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
