const TimeControl = ({ active, onToggle, from, to, time, onChangeTime }: { active: boolean, onToggle: () => void, from: number, to: number, time: number, onChangeTime: (time: number) => void }) => <div style={{ position: 'absolute', bottom: 0, zIndex: 1000 }}>
  <button onClick={onToggle}>Timeline {active ? 'On' : 'Off'}</button>
  {active && <input value={time} min={from} max={to} step={60 * 1000 * 15} onChange={e => {
    onChangeTime(+e.target.value)}} type="range" style={{width: '60vw' }}/>}
    {active && <span>{new Date(time).toString().substring(0, 3) + ' ' + new Date(time).toLocaleString('fi')}</span>}
   
</div>

export default TimeControl
