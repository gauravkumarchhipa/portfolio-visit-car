"use client";
import React, { useState } from 'react'
import ABoutModal from './ABoutModal'
import ExperienceModal from './ExperienceModal'
import PortfolioModal from './PortfolioModal'

const Modal = ({ openModal, setOpenModal }: any) => {
    return (
        <div
            className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 ${openModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            {/* ABOUT MODAL */}
            <ABoutModal openModal={openModal} setOpenModal={setOpenModal} />

            {/* EXPERIENCE MODAL */}
            <ExperienceModal openModal={openModal} setOpenModal={setOpenModal} />

            {/* PORTFOLIO MODAL */}
            <PortfolioModal openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    )
}

export default Modal
