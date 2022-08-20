import classNames from 'classnames'
import { FC, HTMLAttributes, useState } from 'react'
import {
  FaEnvelope,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { Library, Service, serviceTypes } from './api'
import styles from './Info.module.scss'

const Info: FC<
  {
    library: Library
    services: Service[]
    onClose: () => void
    onClickService: (id: number) => void
  } & HTMLAttributes<HTMLDivElement>
> = ({ library, services, onClose, onClickService, className, ...props }) => {
  const [showAllSchedules, setShowAllSchedules] = useState(false)
  return (
    <div className={classNames(className, styles.container)} {...props}>
      <h1>
        {library.Name}{' '}
        <a
          className={styles.link}
          href={`https://www.helmet.fi/library/${library.Id}`}
          title={`${library.Name} Site`}
        >
          {/* TODO Library link is language specific! (library|kirjasto|biblioteka|bibliotek) */}
          <FaExternalLinkAlt size={25} />
        </a>
      </h1>
      <button className={styles.close} onClick={onClose}>
        <MdClose size={20} />
      </button>
      <img
        src={library.Picture.Files.medium.url}
        alt={library.Name}
        className={styles.image}
      />
      <section className={styles.infoSection}>
        <h2>Contact information</h2>
        <div>
          <FaMapMarkerAlt />
          <div style={{ display: 'inline-block' }}>
            {library.Address.Street}
            <br />
            {library.Address.Zipcode} {library.Address.City}
          </div>
        </div>
        <div>
          <FaEnvelope />
          {library.Email}
        </div>
        {library.Phone && (
          <div>
            <FaPhone />
            {library.Phone.Number}
          </div>
        )}
      </section>
      <section>
        <h2>Opening hours</h2>
        {library.Schedules.slice(...(showAllSchedules ? [] : [0, 7])).map(
          schedule => (
            <div key={schedule.Date}>
              {new Date(schedule.Date).toString().substring(0, 3)}{' '}
              {new Date(schedule.Date).toLocaleDateString('fi')}
              {schedule.Sections.SelfService.times.map(time => (
                <div key={time.Opens + ' ' + time.Closes}>
                  {time.Opens} - {time.Closes}{' '}
                  {time.Status === 1 ? 'Staff Present' : 'Self Service'}
                </div>
              ))}
            </div>
          ),
        )}
        {library.Schedules.length > 7 && (
          <button onClick={() => setShowAllSchedules(a => !a)}>
            {showAllSchedules ? 'show less' : 'show more'}
          </button>
        )}
      </section>
      <section>
        <h2>Services</h2>
        {serviceTypes.map(type => (
          <ServiceSubsection
            key={type}
            serviceIds={library.ServiceIds}
            services={services}
            type={type}
            onClickService={onClickService}
          />
        ))}
      </section>
    </div>
  )
}

export default Info

const serviceSectionNames: Record<Service['Type'], string> = {
  web_service: 'Web service',
  hardware: 'Devices',
  service: 'Services',
  room: 'Premises',
  collection: 'Collections',
}

const ServiceSubsection: FC<{
  serviceIds: Library['ServiceIds']
  services: Service[]
  type: Service['Type']
  onClickService: (id: number) => void
}> = ({ serviceIds, services, type, onClickService }) => {
  const sectionServices = services
    .filter(s => serviceIds.includes(s.Id) && s.Type === type)
    .sort((a, b) => (a.Name > b.Name ? 1 : b.Name > a.Name ? -1 : 0))

  if (sectionServices.length === 0) return null
  return (
    <section>
      <h3>{serviceSectionNames[type]}</h3>
      {sectionServices.map(service => (
        <div key={service.Id}>
          <button
            onClick={() => onClickService(service.Id)}
            className={styles.serviceButton}
          >
            {service.Name}
          </button>
        </div>
      ))}
    </section>
  )
}
