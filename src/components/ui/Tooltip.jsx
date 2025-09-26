import { useState, useRef, useEffect } from 'react';

export const Tooltip = ({ 
  children, 
  content, 
  placement = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top + scrollTop - tooltipRect.height - 8;
        left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollTop + 8;
        left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollLeft - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollLeft + 8;
        break;
      default:
        top = triggerRect.top + scrollTop - tooltipRect.height - 8;
        left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight + scrollTop - 8) {
      top = viewportHeight + scrollTop - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, placement]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowClass = () => {
    const baseClass = "absolute w-2 h-2 bg-gray-900 transform rotate-45";
    switch (placement) {
      case 'top':
        return `${baseClass} bottom-[-4px] left-1/2 transform -translate-x-1/2 rotate-45`;
      case 'bottom':
        return `${baseClass} top-[-4px] left-1/2 transform -translate-x-1/2 rotate-45`;
      case 'left':
        return `${baseClass} right-[-4px] top-1/2 transform -translate-y-1/2 rotate-45`;
      case 'right':
        return `${baseClass} left-[-4px] top-1/2 transform -translate-y-1/2 rotate-45`;
      default:
        return `${baseClass} bottom-[-4px] left-1/2 transform -translate-x-1/2 rotate-45`;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg transition-opacity duration-200 ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
          <div className={getArrowClass()}></div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
