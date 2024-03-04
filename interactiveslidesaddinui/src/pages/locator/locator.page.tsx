import React from 'react'
import { useLocatorStore } from './store'
import * as styles from './locator.module.sass'
import { classes } from '../../lib/utils'

export default function LocatorPage() {
  const items = useLocatorStore((state) => state.items)
  const loading = useLocatorStore((state) => state.loading)
  const load = useLocatorStore((state) => state.load)

  return (
    <div className={classes('container', styles.locator)}>
      <h3>State manager example</h3>
      <blockquote>
        This information should be loaded from remote API, stored in state and displayed in the
        component
      </blockquote>

      {loading ? (
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}

      <div className="mb-4" style={{ display: loading ? 'none' : 'inline-block' }}>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={load}>
            Reload
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => useLocatorStore.setState({ items: [] })}
          >
            Clear
          </button>
        </div>

        <br />
        <span className="small">* Small delay is introduced to see the loader</span>
      </div>

      <hr className="border border-danger border-2 opacity-50" />
      {items.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead style={{ position: 'sticky', top: 0 }}>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Address</td>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {item.address_1}, {item.address_2}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {items.length === 0 ? (
        <div className="alert alert-secondary">No items... Try reload the table</div>
      ) : null}
    </div>
  )
}
