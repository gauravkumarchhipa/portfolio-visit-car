"use client";
import React from 'react';
import ABoutModal from './ABoutModal';
import ExperienceModal from './ExperienceModal';
import PortfolioModal from './PortfolioModal';
import SkillsModal from './SkillsModal';

type ModalId = 'about' | 'experience' | 'portfolio' | 'skills';

type ModalProps = {
  openModal: ModalId | null;
  setOpenModal: (v: ModalId | null) => void;
};

const Modal = ({ openModal, setOpenModal }: ModalProps) => {
  if (openModal === 'about') {
    return <ABoutModal openModal={openModal} setOpenModal={setOpenModal} />;
  }
  if (openModal === 'experience') {
    return <ExperienceModal openModal={openModal} setOpenModal={setOpenModal} />;
  }
  if (openModal === 'portfolio') {
    return <PortfolioModal openModal={openModal} setOpenModal={setOpenModal} />;
  }
  if (openModal === 'skills') {
    return <SkillsModal openModal={openModal} setOpenModal={setOpenModal} />;
  }
  return null;
};

export default Modal;
