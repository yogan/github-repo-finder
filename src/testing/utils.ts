/* eslint-disable import/export */
import { render } from '@testing-library/react'

const customRender = (ui: React.ReactElement, options = {}) =>
    render(ui, {
        wrapper: ({ children }) => children,
        ...options,
    })

export { customRender as render }

export * from '@testing-library/react'

import userEvent from '@testing-library/user-event'
export { default as userEvent } from '@testing-library/user-event'
export type UserEvent = ReturnType<typeof userEvent.setup>
