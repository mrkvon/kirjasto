import { Library } from "./api"

const Info = ({library}: {library: Library}) => <div style={{height:"100vh", width: '400px', backgroundColor: '#fff', position: 'absolute', top: 0, right: 0, zIndex: 1000, overflow: 'auto' }}>
      <h1>{library.Name}</h1>
      <img src={library.Picture.Files.medium.url} alt={library.Name} style={{width: '100%'}}/>
    </div>

    export default Info
