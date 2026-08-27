import React, { useState, useEffect } from 'react';
import { simulationService } from '../services/simulationService';
import TempleMap from '../components/TempleMap';
import Loading from '../components/Loading';
import { Map, Layers } from 'lucide-react';

const TempleMapPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await simulationService.getStatus();
      setData(res);
    };
    load();
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="container-fluid p-4">
      <h4 className="fw-bold text-gold mb-1 d-flex align-items-center gap-2">
        <Map size={24} /> Temple Premises GIS & Zone Map
      </h4>
      <p className="text-muted mb-4">Real-time geographic spatial visualization of crowd density markers</p>

      <div style={{ height: '70vh' }}>
        <TempleMap zones={data.zones} />
      </div>
    </div>
  );
};

export default TempleMapPage;
