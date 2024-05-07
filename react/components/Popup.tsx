import React, { FC } from 'react'
import { Overlay } from 'vtex.react-portal'
import { usePixelEventCallback, PixelEventTypes } from 'vtex.pixel-manager'

import MinicartIconButton from './MinicartIconButton'
import { useMinicartCssHandles } from './CssHandlesContext'
import { useMinicartState, useMinicartDispatch } from '../MinicartContext'
import styles from '../styles.css'

export const CSS_HANDLES = [
  'popupWrapper',
  'popupContentContainer',
  'arrowUp',
  'popupChildrenContainer',
] as const

interface Props {
  Icon: React.ComponentType
  quantityDisplay: QuantityDisplayType
  itemCountMode: MinicartTotalItemsType
  customPixelEventId?: string
  customPixelEventName?: PixelEventTypes.EventName
  variation?: string
}

const PopupMode: FC<Props> = props => {
  const {
    children,
    quantityDisplay,
    Icon,
    itemCountMode,
    customPixelEventId,
    customPixelEventName,
    variation,
  } = props

  const {
    open,
    openBehavior,
    hasBeenOpened,
    openOnHoverProp,
  } = useMinicartState()

  const dispatch = useMinicartDispatch()
  const { handles } = useMinicartCssHandles()

  usePixelEventCallback({
    eventId: customPixelEventId,
    eventName: customPixelEventName,
    handler: () => {
      dispatch({ type: 'OPEN_MINICART' })
    },
  })

  const handleClick = () => {
    if (openOnHoverProp) {
      dispatch({ type: 'SET_OPEN_BEHAVIOR', value: 'hover' })
    }

    dispatch({ type: 'CLOSE_MINICART' })
  }

  const handleMouseLeave = () => {
    dispatch({ type: 'CLOSE_MINICART' })
  }

  return (
    <div onMouseLeave={openBehavior === 'hover' ? handleMouseLeave : undefined}>
      <MinicartIconButton
        variation={variation}
        Icon={Icon}
        itemCountMode={itemCountMode}
        quantityDisplay={quantityDisplay}
      />
      {open && (
        <Overlay>
          {openBehavior === 'click' && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <div
              className="fixed top-0 left-0 w-100 h-100"
              onClick={handleClick}
            />
          )}
          <div
            className={`${handles.popupWrapper} ${styles.popupBoxPosition} absolute z-max flex flex-column`}
          >
            <div
              className={`${handles.popupContentContainer} w-100 shadow-3 bg-base`}
            >
              <div
                className={`${handles.arrowUp} ${styles.popupArrowUp} absolute top-0 bg-base h1 w1 pa4 rotate-45`}
              />
              <div
                className={`${handles.popupChildrenContainer} mt3 bg-base relative flex flex-column ph5 pv3`}
              >
                {hasBeenOpened && children}
              </div>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  )
}

export default PopupMode
