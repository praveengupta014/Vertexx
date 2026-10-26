import { Fragment } from 'react';
import { Hero } from '../components/home/Hero';
import { Logos } from '../components/home/Logos';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { Stats } from '../components/home/Stats';
import { SolutionsSection } from '../components/home/SolutionsSection';
import { Testimonials } from '../components/home/Testimonials';
import { CTA } from '../components/home/CTA';

export const Home = () => (<Fragment><Hero/><Logos/><AboutSection/><ServicesSection/><Stats/><SolutionsSection/><Testimonials/><CTA/></Fragment>);
