import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { display, GlobalStyles } from '@mui/system';
import { Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import WorkIcon from '@mui/icons-material/WorkOutlineOutlined';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircleOutlined';
import MobileFriendlyOutlinedIcon from '@mui/icons-material/MobileFriendlyOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined';
import './styles.css'
import BreadCrumps from '../components/BreadCrumps'
window.addEventListener('load', function() { AOS.init(); });
const globalStyles = (
  <GlobalStyles
    styles={{
      '#root': {
        margin: '0',
      },
      ':root': {
        '--color-primary': '#2584ff',
        '--color-secondary': '#00d9ff',
        '--color-accent': '#ff3400',
        '--color-headings': '#1b0760',
        '--color-body': '#918ca4',
        '--color-body-darker': '#5c5577',
        '--color-border': '#ccc',
        '--border-radius': '30px',
      },
      '*': {
        'box-sizing': 'border-box',
      },
      '::selection': {
        background: 'var(--color-primary)',
        color: '#fff',
      },
      html: {
        fontSize: '62.5%',
      },
      img: {
        width: '100%',
      },
      body: {
        fontFamily: 'Inter, Arial, Helvetica, sans-serif',
        fontSize: '2rem',
        lineHeight: '1.5',
        'place-items': 'normal',
        display: 'block',
        color: 'var(--color-body)',
      },
      h1: {
        color: 'var(--color-headings)',
        marginBottom: '1rem',
        lineHeight: '1.1',
        fontSize: '6rem',
      },
      h2: {
        color: 'var(--color-headings)',
        marginBottom: '1rem',
        lineHeight: '1.1',
        fontSize: '4rem',
      },
      h3: {
        color: 'var(--color-headings)',
        marginBottom: '1rem',
        lineHeight: '1.1',
        fontSize: '2.8rem',
        fontWeight: 600,
      },
      p: {
        marginTop: 0,
      },
      '@media screen and (min-width: 1024px)': {
        body: {
          fontSize: '1.8rem',
        },
        h1: {
          fontSize: '8rem',
        },
        h2: {
          fontSize: '4rem',
        },
        h3: {
          fontSize: '2.4rem',
        },
      },
      a: {
        textDecoration: 'none',
      },
    }}
  />
);


function LandingPage() {
  AOS.init();
  return (
    <>
    {globalStyles}
    <Box>
      <header>
      <nav className="nav collapsible">
        <a aria-label="Moshify" className="nav__brand" href="/">
            <img src="./assets/images/logo.svg" alt=""/>
        </a>
        <svg className="icon icon--white nav__toggler">
          <use href="./assets/images/sprite.svg#menu"></use>
        </svg>
        <ul className="list nav__list collapsible__content">
          <li className="nav__item">
            <a  href="/signup-login">Login / SingUp</a>
          </li>
        </ul>
      </nav>
    </header>
    <section className="block block--dark block--skewed-left hero">
      <div className="container grid grid--1x2">
        <header className="block__header hero__content">
          <h1 data-aos="zoom-in-up" className="block__heading">
            Bright Campus
          </h1>
          <p data-aos="zoom-in-up" className="hero__tagline" >
            Make Your School<strong> SMART</strong> Today!
          </p>
          <a data-aos="zoom-in-up"
            href="/signup-login"
            className="btn btn--accent btn--stretched"
            >Get Started
          </a>
        </header>
        <picture data-aos="zoom-in">
          <source
            type="image/webp"
            srcset="./assets/images/banner.webp 1x, ./assets/images/banner@2x.webp 2x"
          />
          <source
            type="image/png"
            srcset="./assets/images/banner.png 1x, ./assets/images/banner@2x.png 2x"
          />
          <img className="hero__image" src="./assets/images/banner.png" alt="" />
        </picture>
      </div>
    </section>
    <section className="block container">
      <header className="block__header">
        <h2>Meet All Your Academic needs</h2>
      </header>
      <BreadCrumps  page="Stu"  title="As a Bright Student..."  />
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-right">
          
        <span className="icon-container">
            <svg className="icon icon--primary">
            <SchoolIcon sx={{color:"#2584ff"}} fontSize="large" />
            </svg>
          </span>
          <h3 className="feature__heading">Improve & Learn Easy. </h3>
          <p>
          We offer you a modern and user-friendly dashboard where you can submit your homework and quizzes, 
          access your teachers' educational content, check your class status, 
          and manage everything a student needs in a school!
          </p>
          {/*
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a> */}
        </div>
        <picture data-aos="zoom-in-left">
          <source
            type="image/webp"
            srcset="./assets/images/easy.webp 1x, ./assets/images/easy@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/easy.jpg 1x, ./assets/images/easy@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/easy@2x.jpg" alt="" />
        </picture>
      </article>
      <BreadCrumps  page="Par"  title="As a Caring Parent..."  />
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-up">
          <span className="icon-container">
            <svg className="icon icon--primary">
              <FamilyRestroomIcon sx={{color:"#2584ff"}} fontSize="large" />
            </svg>
          </span>
          <h3 className="feature__heading">Monitor Progress</h3>
          <p>
          Access your personal dashboard by entering the secret password to monitor your child's progress in school.
           You can also handle all school-related payments directly from your panel.
            </p>
          {/*
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a> */}
        </div>
        <picture data-aos="fade-down">
          <source
            type="image/webp"
            srcset="./assets/images/fast.webp 1x, ./assets/images/fast@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/fast.jpg 1x, ./assets/images/fast@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/fast@2x.jpg" alt="" />
        </picture>
      </article>
      <BreadCrumps page="Tea"  title="As a Innovative Teacher..."  />
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-up">
          <span className="icon-container">
            <svg className="icon icon--primary">
            <WorkIcon sx={{color:"#2584ff"}} fontSize="large" />
            </svg>
          </span>
          <h3 className="feature__heading">Dont worry about your class</h3>
          <p>
          You can be completely confident in your ability to manage your classes with ease using our modern, user-friendly, and fast interface.
          </p>
          {/*
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a> */}
        </div>
        <picture data-aos="fade-down">
          <source
            type="image/webp"
            srcset="./assets/images/wordpress.webp 1x, ./assets/images/wordpress@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/wordpress.jpg 1x, ./assets/images/wordpress@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/wordpress@2x.jpg" alt="" />
        </picture>
      </article>
      <BreadCrumps  page="Pri"  title="As a Dedicated Principal..."  />
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-left">
          <span className="icon-container">
            <svg className="icon icon--primary">
              <SupervisedUserCircle  sx={{color:"#2584ff"}} fontSize="large" />
            </svg>
          </span>
          <h3 className="feature__heading">Your School Your Way</h3>
          <p>
          You will have the power to streamline and enhance every facet of school administration. 
          You can efficiently oversee staff schedules, and ensure adherence to educational policies with ease.
             Communication with parents, teachers, and students is simplified, fostering a supportive and connected school community.
          </p>
          {/*
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a> */}
        </div>
        <picture data-aos="fade-right">
          <source
            type="image/webp"
            srcset="./assets/images/support.webp 1x, ./assets/images/support@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/support.jpg 1x, ./assets/images/support@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/support@2x.jpg" alt="" />
        </picture>
      </article>
    </section>
    <section data-aos="zoom-in-up" className="block container block-domain">
        <h2> Bring your staff and students along</h2>
        <p>
        You can signup your <strong>Students</strong> & <strong>Instructors</strong>  along side with your school itself. 
        </p>
    </section>
    <section data-aos="fade-up" className="block container block-plans">
      <div className="grid grid--1x3">
        <div className="plan">
          <div className="card card--secondary">
            <header className="card__header">
              <h3 className="plan__name">Dashboard for</h3>
              <span className="plan__price">Pricipals</span>
              <span className="plan__description">We can offer these parts in you Dashboard:</span>
            </header>
            <div className="card__body">
              <ul className="list list--tick">
                <li className="list__item">Signup your Students and Instructors</li>
                <li className="list__item">Make & Manage Classes</li>
                <li className="list__item">Disciplinary management</li>
                <li className="list__item">School Calendar</li>
                <li className="list__item">Notification System</li>
                <li className="list__item">And more...</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="plan plan--popular">
          <div className="card card--primary">
            <header className="card__header">
              <h3 className="plan__name">Dashboard for</h3>
              <span className="plan__price">Students</span>
              <span className="plan__description">Your students have accses to these sections:</span>
            </header>
            <div className="card__body">
              <ul className="list list--tick">
                <li className="list__item">Homework & Quiezzes</li>
                <li className="list__item">Academic Planning</li>
                <li className="list__item">Class Chat rooms</li>
                <li className="list__item">Educational Contents</li>
                <li className="list__item">Attendence Status</li>
                <li className="list__item">And more...</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="plan">
          <div className="card card--secondary">
            <header className="card__header">
              <h3 className="plan__name">Dashboard for</h3>
              <span className="plan__price">Instructors</span>
              <span className="plan__description">Your Instructors Dashboard supports these sections:</span>
            </header>
            <div className="card__body">
              <ul className="list list--tick">
                <li className="list__item">Manage Homeworks & Quiezzes</li>
                <li className="list__item">Manage Class Attendence</li>
                <li className="list__item">Manage Student Plannings</li>
                <li className="list__item">Upload Educational Content</li>
                <li className="list__item">Manage Class Chat room</li>
                <li className="list__item">And more...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="block block--dark block--skewed-right block-showcase">
      <header className="block__header">
        <h2>Compability with all devices!</h2>
      </header>
      <div className="container grid grid--1x2">
        <picture data-aos="fade-right" className="block-showcase__image">
          <source
            type="image/webp"
            srcset="./assets/images/ipad.webp 1x, ./assets/images/ipad@2x.webp 2x"
          />
          <source
            type="image/png"
            srcset="./assets/images/ipad.png 1x, ./assets/images/ipad@2x.png 2x"
          />
          <img src="./assets/images/ipad.png" alt="" />
        </picture>
        <ul className="list" data-aos="fade-up">
          <li>
            <div className="media">
              <div className="media__body">
              <div className="media__image">
              </div>
              <DesktopMacOutlinedIcon sx={{fill:"white", mr:1}} fontSize='large'/>
                  <LaptopChromebookOutlinedIcon sx={{fill:"white", mr:1}} fontSize='large'/>
                  <MobileFriendlyOutlinedIcon sx={{fill:"white", mr:1}} fontSize='large'/>
                <h3 className="media__title">Simple Design</h3>
                <p className='simple__design'>
                Our platform features a clean and straightforward design that ensures a seamless user experience. The minimalist interface eliminates unnecessary clutter, making it easy to find what you need without confusion. With thoughtfully organized elements and intuitive navigation, you can effortlessly access all the system's functionalities. This simple yet effective design enhances productivity and reduces the learning curve, allowing you to focus on what's important.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section className="block" data-aos="zoom-in">
      <header className="block__header">
        <h2>What our Customers are Saying</h2>
        <p>
          We are proud to announce that 95% of our customers are happy with our services.
        </p>
      </header>
      <div className="container">
        <div className="card testimonial">
          <div className="grid grid--1x2">
            <div className="testimonial__image">
              <img
                src="./assets/images/testimonial.jpg"
                alt="A happy, smiling customer"
              />
              <span className="icon-container icon-container--accent">
                <svg className="icon icon--white icon--small">
                  <use href="./assets/images/sprite.svg#quotes"></use>
                </svg>
              </span>
            </div>
            <blockquote className="quote">
              <p className="quote__text">
              I've had the pleasure of using Bright Campus for the past six months, and I must say, it has completely revolutionized the way we manage our school operations. From streamlining administrative tasks to enhancing communication, this system has exceeded all our expectations.
              </p>
              <footer>
                <div className="media">
                  <div className="media__image">
                    <svg className="icon icon--primary quote__line">
                      <use href="./assets/images/sprite.svg#line"></use>
                    </svg>
                  </div>
                  <div className="media__body">
                    <h3 className="media__title quote__author">Dr. MoienFar</h3>
                    <p className="quote__organization">Principal of Allameh Helli 7</p>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
    <div className="container">
      <div className="callout callout--primary callout-signup">
        <div className="grid grid--1x2">
          <div className="callout__content">
            <h2 className="callout__heading">Ready to Get Started?</h2>
            <p>
              Sign up Now and Make your school fully online.
            </p>
          </div>
          <a
            href="/signup-login"
            className="btn btn--secondary btn--stretched"
            >Get Started
          </a>
        </div>
      </div>
    </div>
    <footer className="block block--dark footer">
      <div className="container grid footer__sections">
        <div className="footer__brand">
          <img src="./assets/images/logo.svg" alt="" />
          <p className="footer__copyright">Copyright 2025 SheshAbarGhahreman</p>
        </div>
      </div>
    </footer>
    </Box>
    </>
  );
}
export default LandingPage
