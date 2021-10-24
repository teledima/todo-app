import React from "react";
import modalStyles from './dialog.module.css';

const Dialog = ({children, visible}) => {
    const rootClasses = [modalStyles.Dialog]

    if (visible)
        rootClasses.push(modalStyles.active)

    
    return (
        <div className={rootClasses.join(' ')}>
            <div className={modalStyles.DialogContent}>
                {children}
            </div>
        </div>
    )
};

export default Dialog;
