// src/client/features/home/components/Hero.tsx

/**
 * @fileoverview Home hero — the thesis is sound: a quiet extended-grotesque
 * headline and one amber CTA into the catalog, sitting on Char.
 */

import React from 'react';
import { Link } from '@router/index';

import { Button, Text } from '@ui';

import './hero.css';

/** Home hero section: headline, subcopy, and the primary call-to-action. */
const Hero: React.FC = () => (
  <section className="bt-home-hero">
    <div className="bt-home-hero-inner">
      <h1 className="bt-home-hero-title bt-display">
        Find the beat.
        <br />
        Make the record.
      </h1>
      <Text as="p" tone="muted" className="bt-home-hero-sub">
        Type beats in the style of the artists you already love. Hear candidates fast, narrow by
        key, BPM, and mood.
      </Text>
      <div className="bt-home-hero-actions">
        <Button as={Link} variant="primary" size="large" {...{ to: '/sounds' }}>
          Browse sounds
        </Button>
        <Button as={Link} variant="text" size="large" {...{ to: '/auth/signup' }}>
          Create an account
        </Button>
      </div>
    </div>
  </section>
);

export default Hero;
