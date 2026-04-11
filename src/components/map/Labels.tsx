import React from 'react'
import About from './About'
import Experience from './Experience'
import Projects from './Projects'

const Labels = ({ labelsRefs }: any) => {
    return (
        <div
            id="labels-container"
            className="absolute inset-0 pointer-events-none overflow-hidden z-10"
        >
            <About labelsRefs={labelsRefs} />

            <Experience labelsRefs={labelsRefs} />

            <Projects labelsRefs={labelsRefs} />
        </div>
    )
}

export default Labels
