import { useState, type ChangeEvent, type ReactElement } from 'react';
import { getVehicleModels, getVehicleTrims, OTHER_VEHICLE, vehicleMakes, vehicleYears } from '../services/vehicleCatalog';

export const VehicleFields = (): ReactElement => {
  const [make, setMake] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [trim, setTrim] = useState<string>('');
  const models: string[] = getVehicleModels(make, Number(year));
  const trims: string[] = getVehicleTrims(make, model, Number(year));
  const changeMake = (event: ChangeEvent<HTMLSelectElement>): void => {
    setMake(event.target.value);
    setModel('');
    setTrim('');
  };
  const changeYear = (event: ChangeEvent<HTMLSelectElement>): void => {
    setYear(event.target.value);
    setModel('');
    setTrim('');
  };
  const changeModel = (event: ChangeEvent<HTMLSelectElement>): void => {
    setModel(event.target.value);
    setTrim('');
  };

  return <fieldset><legend>Votre véhicule</legend><div className="form-grid">
    <label>Marque *<select name={make === OTHER_VEHICLE ? undefined : 'make'} required value={make} onChange={changeMake}>
      <option value="" disabled>Choisir une marque</option>
      {vehicleMakes.map((item: string): ReactElement => <option key={item}>{item}</option>)}
      <option value={OTHER_VEHICLE}>Autre marque</option>
    </select></label>
    <label>Année *<select name="year" required value={year} onChange={changeYear}>
      <option value="" disabled>Choisir une année</option>
      {vehicleYears.map((item: number): ReactElement => <option key={item}>{item}</option>)}
    </select></label>
    {make === OTHER_VEHICLE && <label className="full-field">Précisez la marque *<input key={year} name="make" required maxLength={80}/></label>}
    <label>Modèle *<select name={model === OTHER_VEHICLE ? undefined : 'model'} required disabled={!make || !year} value={model} onChange={changeModel}>
      <option value="" disabled>{!make || !year ? 'Choisir marque et année' : 'Choisir un modèle'}</option>
      {models.map((item: string): ReactElement => <option key={item}>{item}</option>)}
      <option value={OTHER_VEHICLE}>Autre modèle / non répertorié</option>
    </select></label>
    <label>Version / finition<select name={trim === OTHER_VEHICLE ? undefined : 'trim'} disabled={!model} value={trim} onChange={(event: ChangeEvent<HTMLSelectElement>): void => setTrim(event.target.value)}>
      <option value="">{!model ? 'Choisir un modèle' : trims.length === 0 ? 'Non précisée / non répertoriée' : 'Choisir une finition (facultatif)'}</option>
      {trims.map((item: string): ReactElement => <option key={item}>{item}</option>)}
      <option value={OTHER_VEHICLE}>Autre finition</option>
    </select></label>
    {model === OTHER_VEHICLE && <label className="full-field">Précisez le modèle *<input key={`${make}-${year}`} name="model" required maxLength={80}/></label>}
    {trim === OTHER_VEHICLE && <label className="full-field">Précisez la finition<input key={`${make}-${year}-${model}`} name="trim" maxLength={80}/></label>}
  </div></fieldset>;
};
